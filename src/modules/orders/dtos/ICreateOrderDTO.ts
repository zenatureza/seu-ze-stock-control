import ICreateOrderProductDTO from './ICreateOrderProductDTO';

export default interface ICreateOrderDTO {
  products: ICreateOrderProductDTO[];
  total: number;
}
