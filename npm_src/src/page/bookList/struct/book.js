export default class Book {
  constructor (book = {}) {
    this.id = ''
    this.sourceUuid = ''
    this.title = ''
    this.description = ''
    this.coverImage = ''
    this.coverImageWidth = 0
    this.coverImageHeight = 0
    this.isbn = ''
    this.publisher = ''
    this.uploadedFile = ''
    this.uploadedFileName = ''
    this.createBy = ''
    this.createTime = +new Date()
    this.editStatus = 0
    this.status = 0
    this.processStatus = 0
    this.publishStatus = 0
    this.processMessage = ''
    this.language = 'Chinese'
    this.remark = ''

    Object.assign(this, book)

    this.publishTime ? null : this.publishTime = ''

    this.authors = this.authors || []
    this.translators = this.translators || []
  }
}

export class Author {
  constructor (name = '', description = '') {
    this.name = name
    this.description = description
  }
}
