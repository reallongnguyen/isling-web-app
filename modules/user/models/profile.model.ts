export class Profile {
  constructor(
    public id: string,
    public authId: string,
    public firstName: string,
    public lastName: string | null,
    public avatar: string,
    public role: string[],
    public isActive: boolean,
    public email: string | null = null,
    public phone: string | null = null,
    public createdAt: string,
    public updatedAt: string
  ) {}
}
