

export class Str {
    static capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static reverseString(str: string): string {
        return str.split('').reverse().join('');
    }

    static toLowerCase(str: string): string {
        return str.toLowerCase();
    }

    static toUpperCase(str: string): string {
        return str.toUpperCase();
    }
    static toKebabCase(str: string): string {
        return str
            // utiliza una expresión regular para insertar un guion antes de cada letra mayúscula.
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase();
    }
    static toCamelCase(str: string): string {
        return str
            // divide la cadena en palabras usando un patrón de expresión regular que identifique espacios, guiones y subrayados.
            .split(/-|_| /g)
            // Luego, transforma cada palabra a camelCase.
            .map((word, index) =>
                // Si es la primera palabra, a minúsculas la primera letra.
                // Para las siguientes palabras, convierte el primer carácter a mayúsculas y el resto a minúsculas.
                index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('');
    }

    static toCamelCaseCapitalized(string: string): string {
        return Str.capitalizeFirstLetter(Str.toCamelCase(string));
    }
    static toArray(splitator: string, string: string): string[] {
        return string.split(splitator).map(item => item.trim());
    }
    // Puedes agregar más métodos de utilidad aquí
}


