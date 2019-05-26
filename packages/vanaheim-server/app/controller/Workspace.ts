import { Controller } from 'egg';

interface AddWorkspaceRequest {
  name: string;
  path: string;
}

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
    const result = await this.service.workspace.add(body.name, body.path);
    ctx.body = {
      data: result,
    };
  }

  public async list() {
    const { ctx } = this;
    ctx.body = {
      data: await this.service.workspace.list(),
    };
  }
}
