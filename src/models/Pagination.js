export default class Pagination {
    pageCount = 0;
    currentPage = 0;

    constructor({pageCount, currentPage}) {
        this.pageCount = pageCount;
        this.currentPage = currentPage;
    }
}