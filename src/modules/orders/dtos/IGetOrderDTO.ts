import ICreateOrderProductDTO from "./ICreateOrderProductDTO";

export default interface {
  id: string;
  products: ICreateOrderProductDTO[];
  total: number;
}
