export interface Asset {
 
  assetId: number;           
  assetName: string;         
  assetTag: string;         
  assetType?: string;        
  assetBrand?: string;    
  assetQuantity: any;
  assetLocation?: any;   
  locationName?: string; 
  assetPictureUrl?: string;
  assetStatus: boolean;     
  latestTransaction: any;
  qrCodeId?: any;
  hsnCode?: any;
  assetCost?:any; 
  supplier?: any;
  assignedDate?: any;
  createdDate?: string; 
  quantity?: number;
}