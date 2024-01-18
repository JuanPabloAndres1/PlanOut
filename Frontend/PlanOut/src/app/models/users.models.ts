export interface User {
    name?: string;
    email?: string;
    password?: string;
   
  }
  
export interface Token {
    success?:string;
    token: string
  }