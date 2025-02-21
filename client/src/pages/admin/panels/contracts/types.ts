export type Contract = {
    id: number;
    status: string;
    start_date: string;
    end_date: string;
    pdf_file: string | null;
    car: number;
};

export type ContractListResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Contract[];
};
