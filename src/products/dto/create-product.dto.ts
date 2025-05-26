import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'Product name',
        uniqueItems: true,
        minLength: 3,
        example: 'T-shirt',
    })
    @IsString()
    @MinLength(3)
    name: string

    @ApiProperty({
        description: 'Product price',
        minimum: 0,
        maximum: 10000,
        example: 100,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number

    @ApiProperty({
        description: 'Product description',
        example: 'A comfortable and stylish t-shirt',
    })
    @IsString()
    @IsOptional()
    description?: string

    @ApiProperty({
        description: 'Product slug',
        example: 't-shirt',
    })
    @IsString()
    @IsOptional()
    slug?: string

    @ApiProperty({
        description: 'Product stock',
        example: '10',
        minLength: 3,
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number

    @IsString({ each: true })
    @IsArray()
    sizes: string[]

    @IsIn(['unisex'])
    gender: string

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[]

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[]
}
