import { AddWorkspaceRequest, DeleteWorkspaceRequest, ListFileResponse } from 'vanaheim-shared';
import { Controller } from 'egg';

export default class WorkspaceController extends Controller {
  public async add() {
    const { ctx } = this;
    const body: AddWorkspaceRequest = ctx.request.body;
    ctx.validate(
      {
        name: 'string',
        path: 'string',
      },
      body
    );
    const { path, name, _id: id, createdAt, modifiedAt } = await this.service.workspace.add(
      body.name,
      body.path
    );
    ctx.body = {
      data: { path, name, id, createdAt, modifiedAt },
    };
  }

  public async list() {
    const { ctx } = this;
    ctx.body = {
      data: await this.service.workspace.list(),
    };
  }

  public async delete() {
    const { ctx } = this;
    const body: DeleteWorkspaceRequest = ctx.request.body;
    ctx.validate(
      {
        id: 'string',
      },
      body
    );
    await this.service.workspace.delete(body.id);
    ctx.body = {
      data: body.id,
    };
  }

  public async listFile() {
    const { ctx } = this;
    ctx.validate(
      {
        parent: 'string',
      },
      ctx.query
    );

    const response: ListFileResponse = {
      data: [...(await ctx.service.workspace.listFile(ctx.query.parent))],
    };

    ctx.body = response;
  }
}
