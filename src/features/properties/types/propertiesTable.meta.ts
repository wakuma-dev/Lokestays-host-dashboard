import type { Properties } from "./properties.types";
export interface PropertiesTableMeta {
    readonly header: string;
    readonly paragraph: string;
    onView: (properties: Properties) => void;
    onEdit: (properties: Properties) => void;
    onDelete: (properties: Properties) => void;
}