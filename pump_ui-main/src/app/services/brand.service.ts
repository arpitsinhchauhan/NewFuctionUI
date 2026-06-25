import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private defaultBranding = {
    logo: 'assets/img/logo.png',
    pumpName: 'PUMP MANAGER',
    themeColor: '#6366f1',
    subtitle: 'Fueling Efficiency'
  };

  getBranding() {
    const tenantData = JSON.parse(localStorage.getItem('tenantData') || '{}');
    return {
      logo: tenantData.logoUrl || this.defaultBranding.logo,
      pumpName: tenantData.pumpName || this.defaultBranding.pumpName,
      themeColor: tenantData.themeColor || this.defaultBranding.themeColor,
      subtitle: tenantData.subtitle || this.defaultBranding.subtitle
    };
  }

  setBranding(data: any) {
    localStorage.setItem('tenantData', JSON.stringify(data));
  }
}
