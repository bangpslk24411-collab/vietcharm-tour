/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, type Request, type Response } from 'express';
import type { Model } from 'mongoose';

export interface CrudRouterOptions {
  /** Maps a `?param=value` query string onto a Mongo filter fragment for `GET /`. */
  listFilters?: Record<string, (value: string) => Record<string, unknown>>;
  /** Sort applied to `GET /` results. */
  listSort?: Record<string, 1 | -1>;
  /** Set to false for append-only resources (no `PATCH /:id`), e.g. transactions. */
  withPatch?: boolean;
}

/**
 * Standard CRUD router shared by every Mongo resource:
 *   GET /  ·  GET /:id  ·  POST / (body must include `id`, stored as `_id`)
 *   PATCH /:id  ·  DELETE /:id
 * `label` appears in 404 messages ("<label> not found").
 */
export function createCrudRouter(
  model: Model<any>,
  label: string,
  { listFilters, listSort, withPatch = true }: CrudRouterOptions = {},
): Router {
  const router = Router();
  const notFound = (res: Response) => res.status(404).json({ message: `${label} not found` });
  const serverError = (res: Response, error: unknown) =>
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server Error' });
  const badRequest = (res: Response, error: unknown) =>
    res.status(400).json({ message: error instanceof Error ? error.message : 'Bad Request' });

  router.get('/', async (req: Request, res: Response) => {
    try {
      const filter: Record<string, unknown> = {};
      for (const [param, toFilter] of Object.entries(listFilters ?? {})) {
        const value = req.query[param];
        if (value) Object.assign(filter, toFilter(String(value)));
      }
      const query = model.find(filter);
      res.json(await (listSort ? query.sort(listSort) : query));
    } catch (error) {
      serverError(res, error);
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const doc = await model.findById(req.params.id);
      if (!doc) return notFound(res);
      res.json(doc);
    } catch (error) {
      serverError(res, error);
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const { id, ...rest } = req.body ?? {};
      if (!id) return res.status(400).json({ message: 'id is required' });
      res.status(201).json(await model.create({ _id: id, ...rest }));
    } catch (error) {
      badRequest(res, error);
    }
  });

  if (withPatch) {
    router.patch('/:id', async (req: Request, res: Response) => {
      try {
        const { id: _ignored, ...updates } = req.body ?? {};
        const doc = await model.findByIdAndUpdate(req.params.id, updates, {
          new: true,
          runValidators: true,
        });
        if (!doc) return notFound(res);
        res.json(doc);
      } catch (error) {
        badRequest(res, error);
      }
    });
  }

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const doc = await model.findByIdAndDelete(req.params.id);
      if (!doc) return notFound(res);
      res.status(204).send();
    } catch (error) {
      serverError(res, error);
    }
  });

  return router;
}
