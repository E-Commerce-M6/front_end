import { commentSchema } from "@/schemas";
import { IUser, IUserComment } from "./user.interfaces";
import { z } from "zod";

export type TEditComment = z.infer<typeof commentSchema>;

export interface IComment extends IUserComment {
  id: string;
  user: IUser;
  createdAt: string;
}

export interface IEditComment extends IUserComment {
  id: string;
  user: IUser;
  createdAt: string;
}
