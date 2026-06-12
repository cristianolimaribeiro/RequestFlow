import { Response, NextFunction } from 'express';
import { RequestService } from '../services/requestService';

export class RequestController {
  private service = new RequestService();

  listAll = async (req: any, res: Response, next: NextFunction) => {
    try {
      const requests = await this.service.listAll();
      res.json(requests);
    } catch (error) {
      next(error);
    }
  };

  listMy = async (req: any, res: Response, next: NextFunction) => {
    try {
      const requests = await this.service.listByRequester(req.user.id);
      res.json(requests);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: any, res: Response, next: NextFunction) => {
    try {
      const request = await this.service.getById(parseInt(req.params.id));
      res.json(request);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: any, res: Response, next: NextFunction) => {
    try {
      const { title, description, category_id, priority } = req.body;
      if (!title || !description || !category_id || !priority) throw { status: 400, message: 'Campos obrigatórios ausentes' };
      
      const request = await this.service.create({ 
        title, description, category_id, priority, requester_id: req.user.id 
      });
      res.status(201).json(request);
    } catch (error) {
      next(error);
    }
  };

  analyze = async (req: any, res: Response, next: NextFunction) => {
    try {
      const request = await this.service.updateStatus(parseInt(req.params.id), 'em_analise', req.user.id);
      res.json(request);
    } catch (error) {
      next(error);
    }
  };

  approve = async (req: any, res: Response, next: NextFunction) => {
    try {
      const request = await this.service.updateStatus(parseInt(req.params.id), 'aprovada', req.user.id, req.body.comment);
      res.json(request);
    } catch (error) {
      next(error);
    }
  };

  reject = async (req: any, res: Response, next: NextFunction) => {
    try {
      const { comment } = req.body;
      if (!comment) throw { status: 400, message: 'Comentário é obrigatório para reprovação' };
      const request = await this.service.updateStatus(parseInt(req.params.id), 'reprovada', req.user.id, comment);
      res.json(request);
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req: any, res: Response, next: NextFunction) => {
    try {
      const request = await this.service.cancelRequest(parseInt(req.params.id), req.user.id);
      res.json(request);
    } catch (error) {
      next(error);
    }
  };

  complete = async (req: any, res: Response, next: NextFunction) => {
    try {
      const request = await this.service.updateStatus(parseInt(req.params.id), 'concluida', req.user.id);
      res.json(request);
    } catch (error) {
      next(error);
    }
  };

  uploadAttachment = async (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw { status: 400, message: 'Nenhum arquivo enviado' };
      const attachment = await this.service.addAttachment(parseInt(req.params.id), req.user.id, req.file);
      res.status(201).json(attachment);
    } catch (error) {
      next(error);
    }
  };

  downloadAttachment = async (req: any, res: Response, next: NextFunction) => {
    try {
      const attachment = await this.service.getAttachment(parseInt(req.params.attachmentId));
      if (!attachment) throw { status: 404, message: 'Anexo não encontrado' };

      res.setHeader('Content-Type', attachment.file_type);
      res.setHeader('Content-Disposition', `attachment; filename="${attachment.file_name}"`);
      res.send(attachment.file_data);
    } catch (error) {
      next(error);
    }
  };
}
