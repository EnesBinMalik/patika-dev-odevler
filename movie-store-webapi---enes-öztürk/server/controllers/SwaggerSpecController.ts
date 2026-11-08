/**
 * OpenAPI 3.0 / Swagger Specification Controller
 * Author: Enes Öztürk
 */

import { Request, Response } from 'express';

export class SwaggerSpecController {
  public getSpec = (req: Request, res: Response): void => {
    const spec = {
      openapi: '3.0.3',
      info: {
        title: 'Movie Store WebApi - Enes Öztürk',
        version: '1.0.0',
        description: 'Clean Architecture, FluentValidation, AutoMapper, DI Container, JWT/Bearer Authentication ve İlişkisel Veri Bütünlüğü kurallarına tam uyumlu Movie Store RESTful WebAPI.',
        contact: {
          name: 'Enes Öztürk',
          email: 'enesbino38@gmail.com',
        },
      },
      servers: [
        {
          url: '/api',
          description: 'Production / Local WebApi Server',
        },
      ],
      tags: [
        { name: 'Movies', description: 'Film Ekleme, Listeleme, Güncelleme ve Soft-Delete işlemleri' },
        { name: 'Actors', description: 'Oyuncu Yönetimi ve Filmografi Listeleme' },
        { name: 'Directors', description: 'Yönetmen Yönetimi ve Yönetilen Filmler' },
        { name: 'Customers', description: 'Müşteri Kayıt, Giriş, Profil ve Yönetim' },
        { name: 'Orders', description: 'Film Satın Alma ve Müşteri Sipariş Geçmişi (Customer Guard)' },
        { name: 'Genres', description: 'Sistemde Tanımlı Varsayılan Film Türleri' },
        { name: 'Unit Tests', description: 'Eksiksiz Birim Test Koşucusu' },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Customer login sonucunda dönen token değerini "Bearer <token>" formatında giriniz.',
          },
        },
      },
    };
    res.json(spec);
  };
}
