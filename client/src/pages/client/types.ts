// src/types.ts

// Type représentant un contrat individuel
export type Contract = {
    id: number;
    status: string;
    start_date: string;
    end_date: string;
    pdf_file: string | null;
    car: number;
};

// Type représentant la réponse de l'API de contrats
export type ContractResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Contract[];
};
