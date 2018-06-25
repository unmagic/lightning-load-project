
export default class Navigator {
    static init(target) {
        target.clazzName = target.constructor.name;
    }

    static pages = {};

    static putPage(path, value) {
        this.pages[path] = value;
    }

    static getPage(path) {
        return this.pages[path];
    }

    static removePage(path) {
        delete this.pages[path];
    }
}