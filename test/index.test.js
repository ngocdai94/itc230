const expect = require("chai").expect;
const book = require("../lib/bookCollection");
const query = require('querystring');

describe("Book Module", () => {
  /**
   * Get Test
   */
  it("returns requested book", () => {
    const result = book.get("title", "google");
    expect(result).to.deep.equal({title: "Google", author:"Robot #4", price:15});
  });
  
  it("fails w/ invalid book", () => {
    const result = book.get("title", "fake");
    expect(result).to.be.undefined;
  });

    /**
   * Add Test
   */
  it("adds requested book", () => {
    // get old length
    const oldLength = book.getAll().length;

    const url = "title=test&author=dai&price=20";
    const jsonObject = query.parse(url);
    Object.setPrototypeOf(jsonObject, book);

    const result = book.add(jsonObject);
    expect(result).to.deep.equal({added: true, total: oldLength+1});
  });
  
  it("fails w/ has been added", () => {
    // get old length
    const oldLength = book.getAll().length;

    const url = "title=test&author=dai&price=20";
    const jsonObject = query.parse(url);
    Object.setPrototypeOf(jsonObject, book);

    const result = book.add(jsonObject);
    expect(result).to.deep.equal({added: false, total: oldLength});
  });

    /**
   * Delete Test
   */
  it("delete requested book", () => {
    const result = book.delete("title", "google");
    expect(result).to.deep.equal(book.getAll());
  });
  
  it("fails w/ not found to delete book", () => {
    const result = book.delete("title", "fake");
    expect(result).to.be.equal(-1);
  });
 });