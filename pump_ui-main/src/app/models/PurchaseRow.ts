interface PurchaseRow {
    id: any;
    type: string;
    quantity: number | string;
    total: number | string;
    vat: number | string;
    cess: number | string;
    total_purchase: number | string;
    jtcpercentage: number | string;
    date: string;
    userId: string;
    
    vendorName?: string;
    skuName?: string;
    skuNumber?: string;
    hsn?: string;
    mrp?: number | string;
    qtyLtrOrKg?: number | string;
    unit?: string;
    rate?: number | string;
    netTotal?: number | string;
    discount?: number | string;
    taxableValue?: number | string;
    gstPercentage?: number | string;
    gstAmount?: number | string;
    cessPercentage?: number | string;
    cessAmount?: number | string;
    netAmount?: number | string;
}

