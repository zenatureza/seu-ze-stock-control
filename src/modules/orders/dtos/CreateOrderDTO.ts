import CreateOrderProductDTO from './CreateOrderProductDTO';

export default interface ICreateOrderDTO {
  products: CreateOrderProductDTO[];
  total: number;
}
