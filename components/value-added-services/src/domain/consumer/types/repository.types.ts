
type ComparisonOperators<T> = {
    [operator: string]: T | T[] | string | undefined;
};

type NestedCondition<T> = {
    [P in keyof T]?: T[P] | ComparisonOperators<T[P]> | NestedCondition<T[P]>;
};

type OrderBy<T> = {
    [P in keyof T]?: T[P] extends object
    ? T[P] extends Array<any> // Exclude arrays from recursion
    ? 'ASC' | 'DESC'
    : 'ASC' | 'DESC' | OrderBy<T[P]>
    : 'ASC' | 'DESC';
};

export interface FindOptions<T> {
    where: Partial<T>; // Conditions for filtering
    relations?: string[]; // Relations to load
    order?: OrderBy<T>; // Nested ordering options
    take?: number; // Limit the number of results
}

export interface FindOneOptions<T> {
    where: NestedCondition<T>; // Conditions for filtering
    relations?: string[]; // Relations to load
    order?: OrderBy<T>; // Nested ordering options
}