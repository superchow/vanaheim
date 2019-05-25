import { Service } from 'egg';

export default class UserService extends Service {
  async add() {
    const user = await this.ctx.model.User.create([{ realName: 'Diamond' }]);
    console.log(user);
  }

  async get() {
    const res = await this.ctx.model.User.find();
    console.log(res);
    return res;
  }
}
