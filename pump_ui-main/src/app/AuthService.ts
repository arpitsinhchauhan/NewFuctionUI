// auth.service.ts
export class AuthService {
    private xpPetrolNozzle = 0;
  private powerDieselNozzle = 0;
  
  
    setNozzleValues(xp: string, power: string) {
      this.xpPetrolNozzle = +xp;
      this.powerDieselNozzle = +power;
    }
  
    hasExtraNozzles(): boolean {
      return this.xpPetrolNozzle > 0 || this.powerDieselNozzle > 0;
    }
  
    getXpPetrolNozzle(): number {
      return this.xpPetrolNozzle;
    }
  
    getPowerDieselNozzle(): number {
      return this.powerDieselNozzle;
    }
  }
  