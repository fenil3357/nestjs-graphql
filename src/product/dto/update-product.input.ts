import { CreateProductInput } from './create-product.input';
import { InputType, PartialType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends PartialType(OmitType(CreateProductInput, ['user'])) {
}
