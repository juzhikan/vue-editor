export default class Author {
  constructor (opts = {}) {
    const {
      id = null,
      name = '',
      roles = '',
      otherName = '',
      nationality = '',
      birthDate = null,
      description = '',
      aliasNames = '',
      aliasName = '',
      createTime = 0,
      bookCount = 0,
      coverImage = ''
    } = opts

    this.id = id
    this.name = name
    this.otherName = otherName
    this.nationality = nationality
    this.birthDate = birthDate
    this.description = description
    this.createTime = createTime
    this.aliasNames = aliasNames
    this.aliasName = aliasName
    this.bookCount = bookCount
    this.coverImage = coverImage
    roles && typeof roles === 'string' ? this.roles = roles.split(',') : this.roles = roles || []
  }
}
