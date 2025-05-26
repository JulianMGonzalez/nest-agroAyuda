import { Injectable } from '@nestjs/common';
import { initialData } from 'src/seed/data/dataSource';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
  ) { }

  async executeSeed() {
    await this.deleteTables()
    const user = await this.insertNewUsers()
    await this.insertNewProducts(user)

    return 'Seed executed'
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts()

    const queryBuilder = this.userRepository.createQueryBuilder()
    await queryBuilder
      .delete()
      .where({})
      .execute()
  }

  private async insertNewUsers() {
    const seedUsers = initialData.users

    const users: User[] = []

    seedUsers.forEach((user) => {
      user.password = hashSync(user.password, 10),
      users.push( this.userRepository.create(user))
    })
    await this.userRepository.save(users)
    return users[0]
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts()

    const productsSeed = initialData.products

    const insertPromises = []

    productsSeed.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user))
    })

    await Promise.all(insertPromises)

    return true
  }
}
