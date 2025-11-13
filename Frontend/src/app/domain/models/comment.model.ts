export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  user: {
    name: string;
  };
}
