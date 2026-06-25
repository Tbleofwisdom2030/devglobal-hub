import { Request, Response, NextFunction } from 'express';
import { BlogService } from './blog.service';

export class BlogController {
  public static async listPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const result = await BlogService.listPosts(
        parseInt(page as string) || 1,
        parseInt(limit as string) || 10,
        true
      );
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  public static async getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await BlogService.getPostBySlug(req.params.slug);
      res.json({ success: true, data: post });
    } catch (error) { next(error); }
  }

  public static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await BlogService.createPost(req.body);
      res.status(201).json({ success: true, message: 'Post created', data: post });
    } catch (error) { next(error); }
  }

  public static async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await BlogService.updatePost(req.params.id, req.body);
      res.json({ success: true, message: 'Post updated', data: post });
    } catch (error) { next(error); }
  }

  public static async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      await BlogService.deletePost(req.params.id);
      res.json({ success: true, message: 'Post deleted' });
    } catch (error) { next(error); }
  }

  public static async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await BlogService.likePost(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  public static async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await BlogService.addComment(req.params.id, req.user!.sub, req.body.content);
      res.status(201).json({ success: true, data: comment });
    } catch (error) { next(error); }
  }

  public static async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const comments = await BlogService.getComments(req.params.id);
      res.json({ success: true, data: comments });
    } catch (error) { next(error); }
  }

  // Admin list all posts (including drafts)
  public static async adminListPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const result = await BlogService.listPosts(
        parseInt(page as string) || 1,
        parseInt(limit as string) || 20,
        false
      );
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }
}