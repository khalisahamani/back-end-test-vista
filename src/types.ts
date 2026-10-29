export interface CreateCompanyDto {
  name: string;
  registrationNumber: string;
}

export interface CreateServiceDto {
  companyId: number;
  name: string;
  description: string;
  price: number;
}