import { db } from '../database/client.ts'; 
import { courses } from '../database/schema.ts'; 
import { z } from 'zod';
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/courses', {
        schema: {
            tags: ['courses'],
            summary: 'Create a course',
            description: 'Essa rota recebe um título e cria um curso no banco de dados',
            body: z.object({
                title: z.string().min(5, 'Título precisa ter no mínimo 5 caracteres.'),
                description: z.string().optional(),
            }),
            response: {
                201: z.object({courseId: z.uuid()}).describe('Curso criado com sucesso!')
            }
        },
    }, async (request, reply) => {
        const { title, description } = request.body
        
        const result = await db.insert(courses).values({ title, description }).returning()
        
        return reply.status(201).send({ courseId: result[0].id })
    })
}