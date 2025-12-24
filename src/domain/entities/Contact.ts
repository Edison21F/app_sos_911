export interface Contact {
    id: string;
    nombre: string;
    telefono: string;
    descripcion?: string;
    // Agregamos campos que podrían ser útiles en el futuro, pero opcionales por ahora
    avatar?: string;
}
