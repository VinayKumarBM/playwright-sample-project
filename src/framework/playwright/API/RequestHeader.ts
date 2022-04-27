export default class RequestHeader {
    private map = new Map<string, any>();

    public set(key: string, value: any): RequestHeader {
        this.map.set(key, value);
        return this;
    }

    public get() {
        return Object.fromEntries(this.map);
    }
}
