import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as crypto from 'crypto';

import { promisify } from 'util';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;
const SALT = 'a-hardcoded-salt-for-your-app'; // Store this securely, maybe not hardcoded in a real app
const PASSWORD = process.env.ENCRYPTION_PASSWORD || 'default_password';
const scrypt = promisify(crypto.scrypt);

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  private async getKey(): Promise<Buffer> {
    return (await scrypt(PASSWORD, SALT, 32)) as Buffer;
  }

  private async encrypt(text: string): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  private async decrypt(text: string): Promise<string> {
    const key = await this.getKey();
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  async saveApiKey(userId: string, key: string) {
    const encryptedKey = await this.encrypt(key);
    return this.prisma.apiKey.upsert({
      where: { userId_kind: { userId, kind: 'gemini' } },
      update: { key: encryptedKey },
      create: { userId, key: encryptedKey, kind: 'gemini' },
    });
  }

  async summarizeText(userId: string, text: string): Promise<string> {
    const prompt = `Analiza el siguiente texto y genera un resumen conciso y claro en español. El resumen debe capturar las ideas principales y los puntos clave, omitiendo detalles secundarios. El objetivo es que alguien pueda entender la esencia del texto leyéndolo.\n\nTexto a resumir:\n"""\n${text}\n"""`;
    return this.generateText(userId, prompt);
  }

  async rewriteText(userId: string, text: string, style: string): Promise<string> {
    const prompt = `Toma el siguiente texto y reescríbelo completamente en un estilo que sea **${style}**. Mantén el significado central y la información clave, pero adapta el tono, el vocabulario y la estructura de las frases para que reflejen el estilo solicitado. La salida debe ser únicamente el texto reescrito en español.\n\nTexto original:\n"""\n${text}\n"""`;
    return this.generateText(userId, prompt);
  }

  async autoTag(userId: string, text: string): Promise<string[]> {
    const prompt = `Eres un experto en clasificación de contenido. Analiza el siguiente texto y genera entre 3 y 5 etiquetas (tags) relevantes que describan sus temas principales. Las etiquetas deben ser cortas, específicas y en español. Devuelve únicamente una lista de etiquetas separadas por comas (por ejemplo: "inteligencia artificial,programación,javascript").\n\nTexto para analizar:\n"""\n${text}\n"""`;
    const result = await this.generateText(userId, prompt);
    return result.split(',').map(tag => tag.trim());
  }

  async generateText(userId: string, prompt: string): Promise<string> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { userId_kind: { userId, kind: 'gemini' } },
    });

    if (!apiKey) {
      throw new NotFoundException('No se encontró una API key para este usuario.');
    }

    const decryptedKey = await this.decrypt(apiKey.key);
    const genAI = new GoogleGenerativeAI(decryptedKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Track usage
    await this.prisma.aiUsage.upsert({
      where: { userId },
      create: { userId, requests: 1, tokens: text.length },
      update: {
        requests: { increment: 1 },
        tokens: { increment: text.length },
      },
    });

    return text;
  }
}
