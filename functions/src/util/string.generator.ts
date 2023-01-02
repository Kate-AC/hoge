export class StringGenerator {
    static getRamdomCharacters(): string {
        return Math.random().toString(32).substring(2).toUpperCase()
    }
}
