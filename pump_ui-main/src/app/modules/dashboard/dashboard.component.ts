import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as Chartist from 'chartist';
import { DailyTotal } from '../../models/DailyTotal';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as d3 from 'd3';
import { API_CURRENTMOUNTH_TOTAL, API_CURRENTYEAR_TOTAL, API_DAILY_CHART, API_DAILY_TOTAL, API_DIESEL, API_DIESEL_CURRENTYEAR_DATE, API_JAMABAKI_CURRENTYEAR_DATE, API_OIL_PURCHASE_CURRENTYEAR_DATE, API_PETROL_CURRENTYEAR_DATE, API_POWER_DIESEL, API_POWER_DIESEL_CURRENTYEAR_DATE, API_Petrol, API_XP_PETROL_CURRENTYEAR_DATE, API_XP_Petrol } from 'app/serviceult';
import { ChartType, ChartConfiguration } from 'chart.js';
import { LoaderService } from 'app/services/loader.service';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { ThemeService } from 'app/services/theme.service';
import { Subscription } from 'rxjs';
import { TankDetailsDialogComponent } from './components/tank-details-dialog/tank-details-dialog.component';
import { TankConfigDialogComponent } from './components/tank-config-dialog/tank-config-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dailyTotals: DailyTotal[] = [];
  startDate: string = '';
  endDate: string = '';
  productList: any = [];
  name: string = '';
  names: string = '';
  sentTransactions: any[] | undefined;
  receivedTransactions: any[] | undefined;
  senderAmountTotal: number = 0;
  receiverAmountTotal: number = 0;
  totalDifference: number = 0;
  dailyTotal: number;
  CurrentmonthTotal: number = 0;
  CurrentyearTotal: number = 0;
  currentPage = 1;
  itemsPerPage = 2;
  thumbnails: SafeUrl[] = [];
  customers: string[] = [];
  selectedCustomer: string = '';
  showPetrolPumpsCount: number = 0;
  showDieselPumpsCount: number = 0;
  showXpPetrolCount: number = 0;
  showPowerDieselCount: number = 0;
  min: number = 0;
  max: number = 100;
  append: string = '%';
  total: number = 1000000;

  baki: number = 500000;
  label: string = 'UN';
  value: number = 0;
  jamabaki: number;
  jamabakilabel: string;
  diesel: number;
  diesellabel: string;
  petrol: number = 0;
  petrollabel: string = '0';
  xppetrollabel: string = '0';
  powerDiesellabel: string = '0';
  oilPurchaseLabel: string = '0';
  userId = localStorage.getItem('userId');
  filterType: string = 'today';
  selectedYear = new Date().getFullYear();
  yearList: number[] = [];
  xp_petrol_nozzle: number;
  powe_diesel_nozzle: number;

  petrolCurrentStock: number = 0;
  dieselCurrentStock: number = 0;
  xpPetrolCurrentStock: number = 0;
  powerDieselCurrentStock: number = 0;

  petrolCapacity: number = 20000;
  dieselCapacity: number = 20000;
  xpPetrolCapacity: number = 10000;
  powerDieselCapacity: number = 10000;

  nozzleSalesData: any[] = [];
  nozzleFilterType: string = 'today';
  nozzleSelectedYear: number = new Date().getFullYear();

  userRole: string = '';
  dailyReports: any[] = [];
  totalDailyReportsSales: number = 0;
  employeeReportsCount: number = 0;
  shiftReportsCount: number = 0;
  pendingReportsCount: number = 0;
  realMeterSummary: any = null;

  currentTankStocks: any[] = [];
  isLoadingTankStock: boolean = false;
  lowStockAlerts: any[] = [];
  tankStockDate: string = '';



  chartOptions2: any;

  // Properties for standard Chart.js Fuel Distribution pie/doughnut chart
  public pieChartType: ChartType = 'doughnut';
  public pieChartDetails: any[] = [];
  public distributionData: any = null;
  public totalDistributionSum: number = 0;
  public doughnutPlugins: any[] = [
    {
      id: 'doughnutSliceLabels',
      afterDraw: (chart: any) => {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset: any, i: number) => {
          const meta = chart.getDatasetMeta(i);
          if (!meta || !meta.data) return;
          meta.data.forEach((element: any, index: number) => {
            const val = dataset.data[index];
            if (val && val > 0) {
              const pos = element.tooltipPosition();
              if (!pos) return;
              const label = chart.data.labels[index];
              let text = label;
              if (label === 'Digital Payments') text = 'Digital';
              else if (label === 'Oil Stock') text = 'Oil Stock';
              else if (label === 'Indirect Expenses') text = 'Expenses';
              else if (label === 'Diesel Stock') text = 'Diesel Stock';
              else if (label === 'Petrol Stock') text = 'Petrol Stock';
              else if (label === 'Couster Bill ( Baki )') text = 'Baki';
              else if (label === 'Customer Deposits ( Jama )') text = 'Custom.';
              else if (label === 'Lube Oil Sales') text = 'Lube';

              ctx.save();
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 11px Outfit, Inter, sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.shadowColor = 'rgba(0,0,0,0.6)';
              ctx.shadowBlur = 3;
              ctx.fillText(text, pos.x, pos.y);
              ctx.restore();
            }
          });
        });
      }
    }
  ];

  public pieChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverOffset: 15
    }]
  };
  public pieChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '58%',
    plugins: {
      legend: {
        display: false // Hide default legend in favor of infographic-style custom cards legend
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        bodyFont: {
          family: "'Outfit', 'Inter', sans-serif",
          size: 13,
          weight: 'normal'
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            return ` ${label}: ₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        }
      }
    }
  };

  private themeSubscription: Subscription;

  public chartType: ChartType = 'bar';

  public chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderRadius: 8,
        barThickness: 22
      }
    ]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => context.raw.toLocaleString()
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,

        // ✔ Correct place for border in Chart.js v4
        border: {
          display: false,
          color: 'transparent',
          width: 0
        },

        grid: {
          color: '#e0e0e0'   // ✔ allowed
        },

        ticks: {
          callback: function (val) {
            const num = Number(val);
            return num / 1000 + 'K';
          }
        }
      },

      y: {
        border: {
          display: false
        },
        grid: {
          display: false
        }
      }
    }
  };


  constructor(private use: UserServiceService, private http: HttpClient, private dialog: MatDialog,
    private sanitizer: DomSanitizer, private loaderService: LoaderService,
    private notificationService: NotificationService, private themeService: ThemeService
  ) { }


  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.userRole = localStorage.getItem('role') || 'SUPER_ADMIN';
    this.dailyReports = [];
    this.totalDailyReportsSales = 0;
    this.employeeReportsCount = 0;
    this.loaderService.display(false);
    this.getUserName();
    this.getDailytotal();
    this.getCurrentmonthtotal();
    this.getCurrentyear();
    this.getPiechartValue();
    this.getDailyReports();
    this.updatePieChart(); // Initial render with 0s
    this.loadCurrentTankStock();

    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.updateChartThemes(theme);
    });

    // Consolidate pie chart data fetching with error handling for each call
    const errorHandler = (name: string) => catchError(err => {
      console.error(`Error fetching ${name}`, err);
      return of(0);
    });

    forkJoin({
      petrol: this.http.get<any>(`${API_PETROL_CURRENTYEAR_DATE}?userId=${this.userId}`).pipe(errorHandler('petrol')),
      diesel: this.http.get<any>(`${API_DIESEL_CURRENTYEAR_DATE}?userId=${this.userId}`).pipe(errorHandler('diesel')),
      xpPetrol: this.http.get<any>(`${API_XP_PETROL_CURRENTYEAR_DATE}?userId=${this.userId}`).pipe(errorHandler('xpPetrol')),
      powerDiesel: this.http.get<any>(`${API_POWER_DIESEL_CURRENTYEAR_DATE}?userId=${this.userId}`).pipe(errorHandler('powerDiesel')),
      oilPurchase: this.http.get<any>(`${API_OIL_PURCHASE_CURRENTYEAR_DATE}?userId=${this.userId}`).pipe(errorHandler('oilPurchase')),
      jamaBaki: this.http.get<any>(`${API_JAMABAKI_CURRENTYEAR_DATE}?userId=${this.userId}`).pipe(errorHandler('jamaBaki')),
      pumpData: this.use.getUserPump(this.userId).pipe(catchError(err => {
        console.error('Error fetching pumpData', err);
        return of({ success: false });
      })),
      petrolStock: this.use.getPetrolStock(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('petrolStock')),
      dieselStock: this.use.getDieselStock(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('dieselStock')),
      xpPetrolStock: this.use.getXpPetrolStock(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('xpPetrolStock')),
      powerDieselStock: this.use.getPowerDieselStock(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('powerDieselStock')),
      // Nozzle sales lists
      petrolSales: this.use.getPetrolList(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('petrolSales')),
      dieselSales: this.use.getDieselList(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('dieselSales')),
      xpPetrolSales: this.use.getXPPetrolList(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('xpPetrolSales')),
      powerDieselSales: this.use.getpowerDiesel(this.use.getFormattedDate(new Date()), this.userId).pipe(errorHandler('powerDieselSales')),
      distribution: this.use.getDashboardDistribution(this.userId).pipe(errorHandler('distribution'))
    }).subscribe({
      next: (results: any) => {
        // console.log('Dashboard data fetched successfully:', results);

        this.processNozzleData(results);
        this.distributionData = results.distribution;

        // Stock Levels
        this.petrolCurrentStock = results.petrolStock?.petrolRemaining || 0;
        this.dieselCurrentStock = results.dieselStock?.dieselRemaining || 0;
        this.xpPetrolCurrentStock = results.xpPetrolStock?.xppetrolRemaining || 0;
        this.powerDieselCurrentStock = results.powerDieselStock?.powerdieselRemaining || 0;

        // Petrol
        this.petrollabel = results.petrol || 0;
        this.petrol = Math.round(((Number(results.petrol) || 0) / this.total) * 100);

        // Diesel
        this.diesellabel = results.diesel || 0;
        this.diesel = Math.round(((Number(results.diesel) || 0) / this.total) * 100);

        // XP/Power/Oil
        this.xppetrollabel = results.xpPetrol || 0;
        this.powerDiesellabel = results.powerDiesel || 0;
        this.oilPurchaseLabel = results.oilPurchase || 0;

        // Jama Baki
        this.jamabakilabel = results.jamaBaki || 0;
        this.jamabaki = Math.round(((Number(results.jamaBaki) || 0) / this.baki) * 100);

        // Pump Data
        if (results.pumpData && results.pumpData.success && results.pumpData.data) {
          const data = results.pumpData.data;
          this.showPetrolPumpsCount = data.petrol_nozzle;
          this.showDieselPumpsCount = data.diesel_nozzle;
          this.showXpPetrolCount = data.xp_petrol_nozzle;
          this.showPowerDieselCount = data.powe_diesel_nozzle;
        }

        this.updatePieChart();
      },
      error: (err) => console.error('Critical error in Dashboard data fetching', err)
    });

    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 4; y <= currentYear + 1; y++) {
      this.yearList.push(y);
    }
    this.loadRealMeterSummary();
  }

  eodStatusData: any = null;

  loadRealMeterSummary() {
    if (!this.userId) return;
    const todayStr = this.use.getFormattedDate(new Date());
    this.use.getDailyConsolidatedReport(todayStr, this.userId).subscribe(res => {
      if (res && res.success) {
        this.realMeterSummary = res;
      }
    });

    this.use.getEodStatus(todayStr, this.userId).subscribe(res => {
      if (res && res.success) {
        this.eodStatusData = res;
      }
    });
  }

  loadCurrentTankStock(showToast: boolean = false): void {
    if (!this.userId) return;
    this.isLoadingTankStock = true;
    const dateStr = this.use.getFormattedDate(new Date());
    this.tankStockDate = dateStr;
    this.use.getCurrentTankStock(dateStr, this.userId).subscribe(
      (res: any[]) => {
        this.isLoadingTankStock = false;
        this.currentTankStocks = res || [];
        this.lowStockAlerts = this.currentTankStocks.filter(
          t => t.lowStock || t.status === 'LOW' || t.status === 'CRITICAL'
        );
        if (showToast) {
          this.notificationService.success('Tank stocks updated successfully.');
        }
      },
      (err) => {
        this.isLoadingTankStock = false;
        console.error('Error loading current tank stocks', err);
        if (showToast) {
          this.notificationService.failure('Failed to fetch tank stocks.');
        }
      }
    );
  }

  openTankDetails(tank: any): void {
    this.dialog.open(TankDetailsDialogComponent, {
      data: {
        ...tank,
        businessDate: this.tankStockDate || this.use.getFormattedDate(new Date())
      },
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-md'],
      width: '650px'
    });
  }

  openTankConfig(): void {
    const dialogRef = this.dialog.open(TankConfigDialogComponent, {
      data: {
        tanks: this.currentTankStocks,
        userId: this.userId
      },
      hasBackdrop: true,
      panelClass: ['dialog-modern-wrapper', 'dialog-md'],
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadCurrentTankStock(true);
      }
    });
  }

  onNozzleFilterChange() {
    this.getNozzleData();
  }

  getNozzleData() {
    let startDate: string;
    let endDate: string;
    const now = new Date();

    if (this.nozzleFilterType === 'today') {
      startDate = endDate = this.use.getFormattedDate(now);
    } else if (this.nozzleFilterType === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = this.use.getFormattedDate(firstDay);
      endDate = this.use.getFormattedDate(now);
    } else if (this.nozzleFilterType === 'year') {
      const firstDay = new Date(now.getFullYear(), 0, 1);
      startDate = this.use.getFormattedDate(firstDay);
      endDate = this.use.getFormattedDate(now);
    } else if (this.nozzleFilterType === 'fy') {
      startDate = `${this.nozzleSelectedYear}-04-01`;
      endDate = `${this.nozzleSelectedYear + 1}-03-31`;
    }

    const getRangeList = (url: string) => {
      let params = new HttpParams().set('userId', this.userId);
      if (this.nozzleFilterType === 'today') {
        params = params.set('date', startDate);
      } else {
        params = params.set('startDate', startDate).set('endDate', endDate);
      }
      return this.http.get<any[]>(url, { params }).pipe(catchError(() => of([])));
    };

    forkJoin({
      petrolSales: getRangeList(API_Petrol),
      dieselSales: getRangeList(API_DIESEL),
      xpPetrolSales: getRangeList(API_XP_Petrol),
      powerDieselSales: getRangeList(API_POWER_DIESEL),
      pumpData: this.use.getUserPump(this.userId).pipe(catchError(() => of({})))
    }).subscribe((results: any) => {
      this.processNozzleData(results);
    });
  }

  processNozzleData(results: any) {
    const nozzleSalesMap = new Map<string, any>();

    const addSkeleton = (count: number, fuelType: string, prefix: string) => {
      for (let i = 1; i <= (count || 0); i++) {
        const name = `${prefix} ${i}`;
        // Use a standardized key for the map: "pump-name|fuel-type"
        const key = `${name.toLowerCase().trim()}|${fuelType.toLowerCase()}`;
        nozzleSalesMap.set(key, {
          nozzleName: name,
          fuelType: fuelType,
          liters: 0,
          amount: 0
        });
      }
    };

    const pumpInfo = results.pumpData?.data || {};
    addSkeleton(Number(pumpInfo.petrol_nozzle), 'Petrol', 'Petrol nozzle');
    addSkeleton(Number(pumpInfo.diesel_nozzle), 'Diesel', 'Diesel nozzle');
    addSkeleton(Number(pumpInfo.xp_petrol_nozzle), 'XP Petrol', 'xpPetrol nozzle');
    addSkeleton(Number(pumpInfo.powe_diesel_nozzle), 'Power Diesel', 'powerDiesel nozzle');

    const merge = (list: any[], fuelType: string, ltrField: string) => {
      if (!list || !Array.isArray(list)) return;
      list.forEach(item => {
        const rawName = item.pump || 'Unknown';
        const name = rawName.replace(/Pump/gi, 'nozzle').trim();
        const key = `${name.toLowerCase()}|${fuelType.toLowerCase()}`;

        if (!nozzleSalesMap.has(key)) {
          nozzleSalesMap.set(key, {
            nozzleName: name,
            fuelType: fuelType,
            liters: 0,
            amount: 0
          });
        }

        const data = nozzleSalesMap.get(key);
        data.liters += Number(item[ltrField]) || 0;
        data.amount += Number(item.total_sell) || 0;
      });
    };

    merge(results.petrolSales, 'Petrol', 'petrol_ltr');
    merge(results.dieselSales, 'Diesel', 'diesel_ltr');
    merge(results.xpPetrolSales, 'XP Petrol', 'xppetrol_ltr');
    merge(results.powerDieselSales, 'Power Diesel', 'powerdiesel_ltr');

    this.nozzleSalesData = Array.from(nozzleSalesMap.values());
  }

  onFilterChange() {
    this.getPiechartValue();
  }

  getUserName() {
    this.use.getUserNameAndNozzle(this.userId).subscribe(
      data => {
        this.xp_petrol_nozzle = Number(data.data.xp_petrol_nozzle);
        this.powe_diesel_nozzle = Number(data.data.powe_diesel_nozzle);
      }
    );
  }


  fetchData(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }
    const formattedStartDate = this.formatDate(this.startDate);
    const formattedEndDate = this.formatDate(this.endDate);

    this.use.getDailyTotals(formattedStartDate, formattedEndDate, this.userId)
      .subscribe(data => {
        this.dailyTotals = data;
      });

  }

  formatDate(date: string): string {
    const parts = date.split('-');
    if (parts.length !== 3) {
      this.notificationService.failure('Invalid date format.');
      return '';
    }
    const [year, month, day] = parts;
    return `${year}-${month}-${day}`;
  }

  getTotalRsSum(): number {
    return this.dailyTotals.reduce((sum, dailyTotal) => sum + dailyTotal.dailyTotal, 0);
  }

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;
    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });
    seq = 0;
  };
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });
    seq2 = 0;
  };


  getDailytotal() {
    const userId = localStorage.getItem('userId');
    const url = `${API_DAILY_TOTAL}?userId=${userId}`;
    this.http.get<{ id: number, date: string, dailyTotal: number }[]>(url)
      .subscribe((data) => {
        if (data && data.length > 0) {
          this.dailyTotal = data[0].dailyTotal;
        }
      });
  }

  getCurrentmonthtotal() {
    this.http.get<number>(`${API_CURRENTMOUNTH_TOTAL}?userId=${this.userId}`).subscribe((data) => {
      this.CurrentmonthTotal = data;
    });
  }

  getCurrentyear() {
    this.http.get<number>(`${API_CURRENTYEAR_TOTAL}?userId=${this.userId}`).subscribe((data) => {
      (data);
      this.CurrentyearTotal = data;
    });
  }
  createPieChart(data: any): void {
    const summaryData = [
      parseFloat(data.dieselSellSummary[0][0]),
      parseFloat(data.kharchSellSummary[0][0]),
      parseFloat(data.oilSellSummary[0][0]),
      parseFloat(data.petrolSellSummary[0][0]),
      parseFloat(data.purchaseSellSummary[0][0]),
      parseFloat(data.transactionSellSummary[0][0])
    ];
    const labels = [
      'Diesel Sell Summary',
      'Kharch Sell Summary',
      'Oil Sell Summary',
      'Petrol Sell Summary',
      'Purchase Sell Summary',
      'Transaction Sell Summary'
    ];
    const width = 350;
    const height = 350;
    const radius = Math.min(width, height) / 2;
    const svg = d3.select('#pieChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie();
    const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
    const pieData = pie(summaryData);
    svg.selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.index.toString()))
      .attr('stroke', 'white')
      .attr('stroke-width', '2px');
    svg.selectAll('text')
      .data(pieData)
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(d => labels[d.index]);
  }

  getPiechartValue() {
    let params = new HttpParams()
      .set('userId', this.userId)
      .set('filter', this.filterType);
    if (this.filterType === 'fy') {
      params = params.set('year', this.selectedYear.toString());
    }
    this.http.get<any>(`${API_DAILY_CHART}`, { params }).subscribe((data) => {

      const labels = [
        'Petrol Sale', 'XP Petrol Sale', 'Power Diesel Sale', 'Diesel Sale',
        'Oil Sale', 'Indirect Expenses', 'Credit ATM & Wallet', 'Deposit Bill', 'Customer Outstanding',
        'Petrol Purchase', 'Diesel Purchase', 'XP Petrol Purchase', 'Power Diesel Purchase', 'Oil Purchase'
      ];

      const datasetData = [
        data.petrolSellTotal,
        data.xpPetrolSellTotal,
        data.powerDieselSellTotal,
        data.dieselSellTotal,
        data.oilSellTotal,
        data.kharchTotal,
        data.atmTotal,
        data.jamaTotal,
        data.bakiTotal,
        data.totalPetrolPurchase,
        data.totalDieselPurchase,
        data.xpTotalPetrolPurchase,
        data.powerTotalDieselPurchase,
        data.totalOilPurchase
      ];

      const colors = [
        '#1b676f', '#ef7c8f', '#00A36C', '#4f52ec',
        '#EBB403', '#FF9F40', '#C9CBCF', '#00A36C',
        '#FF6F61', '#8A2BE2', '#FFD700', '#40E0D0', '#DC143C', '#20B2AA'
      ];

      // Remove XP/Power if nozzle count 0
      if (this.xp_petrol_nozzle === 0 && this.powe_diesel_nozzle === 0) {
        const removeLabels = ['XP Petrol Sale', 'Power Diesel Sale', 'XP Petrol Purchase', 'Power Diesel Purchase'];
        removeLabels.forEach(label => {
          const idx = labels.indexOf(label);
          if (idx !== -1) {
            labels.splice(idx, 1);
            datasetData.splice(idx, 1);
            colors.splice(idx, 1);
          }
        });
      }

      // Assign final chart data
      this.chartData = {
        labels: labels,
        datasets: [{
          data: datasetData,
          backgroundColor: colors,
          hoverBackgroundColor: colors,
          borderRadius: 8,
          barThickness: 22
        }]
      };

    });
  }

  updateChartThemes(theme: 'light' | 'dark') {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#64748b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0';



    // Update Sales Summary Options
    this.chartOptions = {
      ...this.chartOptions,
      scales: {
        x: {
          ...this.chartOptions.scales.x,
          grid: { color: gridColor },
          ticks: { ...this.chartOptions.scales.x.ticks, color: textColor }
        },
        y: {
          ...this.chartOptions.scales.y,
          ticks: { color: textColor }
        }
      }
    };

    this.updatePieChart(theme);
  }






  // Individual data fetchers removed as they are now handled by forkJoin in ngOnInit

  // updatePieChart() {
  //   this.chartOptions2 = {
  //     animationEnabled: true,
  //     title: { text: "Fuel & Baki Distribution" },
  //     data: [{
  //       type: "pie",
  //       startAngle: 240,
  //       indexLabelPlacement: "outside",
  //       indexLabelFontSize: 14,
  //       indexLabelLineColor: "#000",
  //       indexLabelLineThickness: 1,
  //       indexLabel: "{label} - {y}",
  //       dataPoints: [
  //         { y: Number(this.petrollabel), label: "Petrol" },
  //         { y: Number(this.diesellabel), label: "Diesel" },
  //         { y: Number(this.xppetrollabel), label: "XP Petrol" },
  //         { y: Number(this.powerDiesellabel), label: "Power Diesel" },
  //         { y: Number(this.jamabakilabel), label: "Total Baki" },
  //       ]
  //     }]
  //   };
  // }
  // Helper to safely parse numeric values from potential string formats (with commas)
  private parseChartValue(val: any): number {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'string') {
      // Remove commas and parse
      const cleaned = val.replace(/,/g, '');
      return parseFloat(cleaned) || 0;
    }
    return Number(val) || 0;
  }

  updatePieChart(theme?: 'light' | 'dark') {
    // Most reliable theme detection
    const currentTheme = theme || this.themeService.getCurrentTheme() || (document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    const isDark = currentTheme === 'dark';

    // Explicit colors to avoid theme overrides
    const textColor = isDark ? "#ffffff" : "#1e293b";
    const borderColor = isDark ? "#1e293b" : "#ffffff";

    // Real values from distribution endpoint or live dashboard metrics for THIS pump only
    const digitalVal = this.parseChartValue(this.distributionData?.digitalPayments);
    const oilStockVal = this.distributionData?.oilStock != null && Number(this.distributionData.oilStock) > 0
      ? Number(this.distributionData.oilStock)
      : this.parseChartValue(this.oilPurchaseLabel);
    const expensesVal = this.parseChartValue(this.distributionData?.indirectExpenses);
    const dieselStockVal = this.distributionData?.dieselStock != null && Number(this.distributionData.dieselStock) > 0
      ? Number(this.distributionData.dieselStock)
      : (this.dieselCurrentStock || 0);
    const petrolStockVal = this.distributionData?.petrolStock != null && Number(this.distributionData.petrolStock) > 0
      ? Number(this.distributionData.petrolStock)
      : (this.petrolCurrentStock || 0);
    const bakiVal = this.distributionData?.cousterBillBaki != null && Number(this.distributionData.cousterBillBaki) > 0
      ? Number(this.distributionData.cousterBillBaki)
      : this.parseChartValue(this.jamabakilabel);
    const jamaVal = this.parseChartValue(this.distributionData?.customerDepositsJama);
    const lubeSalesVal = this.parseChartValue(this.distributionData?.lubeOilSales);

    // Items for this pump only
    const items = [
      { name: 'Digital Payments', value: digitalVal, color: '#26466d', desc: 'UPI, ATM & digital payments' },
      { name: 'Oil Stock', value: oilStockVal, color: '#8da843', desc: 'Lubricants inventory value' },
      { name: 'Indirect Expenses', value: expensesVal, color: '#7c2727', desc: 'Operating expenses & kharch' },
      { name: 'Diesel Stock', value: dieselStockVal, color: '#be473c', desc: 'Current diesel inventory' },
      { name: 'Petrol Stock', value: petrolStockVal, color: '#3b78b5', desc: 'Current petrol inventory' },
      { name: 'Couster Bill ( Baki )', value: bakiVal, color: '#75508a', desc: 'Customer outstanding credit' },
      { name: 'Customer Deposits ( Jama )', value: jamaVal, color: '#38a5b2', desc: 'Customer payment deposits' },
      { name: 'Lube Oil Sales', value: lubeSalesVal, color: '#e8802a', desc: 'Retail lube oil sales' }
    ];

    const totalSum = items.reduce((sum, it) => sum + it.value, 0);
    this.totalDistributionSum = totalSum;

    const labels: string[] = [];
    const data: number[] = [];
    const colors: string[] = [];

    this.pieChartDetails = [];

    for (const item of items) {
      labels.push(item.name);
      data.push(item.value);
      colors.push(item.color);

      this.pieChartDetails.push({
        name: item.name,
        value: item.value,
        pct: totalSum > 0 ? (item.value / totalSum) * 100 : 0,
        color: item.color,
        desc: item.desc
      });
    }

    // Update the pie chart dataset
    this.pieChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        borderColor: borderColor,
        borderWidth: 2,
        hoverOffset: 12
      }]
    };

    // Update the layout labels for the chart options based on active theme
    this.pieChartOptions = {
      ...this.pieChartOptions,
      cutout: '58%',
      plugins: {
        ...this.pieChartOptions?.plugins,
        legend: {
          display: false
        },
        tooltip: {
          ...this.pieChartOptions?.plugins?.tooltip,
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.raw as number;
              const pct = totalSum > 0 ? ((value / totalSum) * 100).toFixed(1) : '0.0';
              return ` ${label}: ₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${pct}%)`;
            }
          }
        }
      }
    };
  }

  getDailyReports(): void {
    const role = localStorage.getItem('role') || 'SUPER_ADMIN';
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    if (role === 'PUMP_MANAGER' || role === 'user') {
      this.use.getManagerReports(+userId).subscribe({
        next: (data) => {
          this.employeeReportsCount = data ? data.length : 0;
          this.dailyReports = this.aggregateReports(data || []);
          this.calculateDailyReportsTotal();
        },
        error: (err) => console.error('Error fetching manager daily reports:', err)
      });
    } else if (role === 'EMPLOYEE' || role === 'employee') {
      this.use.getEmployeeReports(+userId).subscribe({
        next: (data) => {
          this.employeeReportsCount = data ? data.length : 0;
          this.dailyReports = data || [];
          this.calculateDailyReportsTotal();
        },
        error: (err) => console.error('Error fetching employee daily reports:', err)
      });
    }
  }

  aggregateReports(reports: any[]): any[] {
    const grouped: { [key: string]: any } = {};

    reports.forEach(r => {
      const date = r.reportDate || (r.createdDatetime ? r.createdDatetime.split('T')[0] : '');
      const shift = r.shift || 'Unknown';
      const key = `${date}_${shift}`;

      const sales = Number(r.salesAmount) || 0;
      const creator = r.createdBy || 'Unknown';

      let petrol = 0;
      let diesel = 0;
      let xpPetrol = 0;
      let powerDiesel = 0;

      let stocks: any = null;
      if (typeof r.stockDetails === 'string') {
        try {
          stocks = JSON.parse(r.stockDetails);
        } catch (e) {
          stocks = null;
        }
      } else if (r.stockDetails && typeof r.stockDetails === 'object') {
        stocks = r.stockDetails;
      }

      if (stocks) {
        if (Array.isArray(stocks)) {
          stocks.forEach((s: any) => {
            const val = Number(s.value) || 0;
            if (s.fuel === 'petrol' || s.fuel === 'PetrolRemaining') petrol += val;
            else if (s.fuel === 'diesel' || s.fuel === 'DieselRemaining') diesel += val;
            else if (s.fuel === 'xpPetrol' || s.fuel === 'XpPetrolRemaining') xpPetrol += val;
            else if (s.fuel === 'powerDiesel' || s.fuel === 'PowerDieselRemaining') powerDiesel += val;
          });
        } else {
          petrol = Number(stocks.petrolRemaining) || Number(stocks.petrol) || 0;
          diesel = Number(stocks.dieselRemaining) || Number(stocks.diesel) || 0;
          xpPetrol = Number(stocks.xpPetrolRemaining) || Number(stocks.xpPetrol) || 0;
          powerDiesel = Number(stocks.powerDieselRemaining) || Number(stocks.powerDiesel) || 0;
        }
      }

      if (!grouped[key]) {
        grouped[key] = {
          reportId: r.reportId,
          reportDate: date,
          reportTime: r.reportTime || '',
          createdDatetime: r.createdDatetime || '',
          shift: shift,
          createdByList: [creator],
          salesAmount: sales,
          petrolRemaining: petrol,
          dieselRemaining: diesel,
          xpPetrolRemaining: xpPetrol,
          powerDieselRemaining: powerDiesel
        };
      } else {
        grouped[key].salesAmount += sales;
        grouped[key].petrolRemaining += petrol;
        grouped[key].dieselRemaining += diesel;
        grouped[key].xpPetrolRemaining += xpPetrol;
        grouped[key].powerDieselRemaining += powerDiesel;

        if (!grouped[key].createdByList.includes(creator)) {
          grouped[key].createdByList.push(creator);
        }

        if (r.reportTime && (!grouped[key].reportTime || r.reportTime > grouped[key].reportTime)) {
          grouped[key].reportTime = r.reportTime;
        }
        if (r.createdDatetime && (!grouped[key].createdDatetime || r.createdDatetime > grouped[key].createdDatetime)) {
          grouped[key].createdDatetime = r.createdDatetime;
        }
      }
    });

    return Object.values(grouped).map(g => {
      const stockObj = {
        petrolRemaining: g.petrolRemaining,
        dieselRemaining: g.dieselRemaining,
        xpPetrolRemaining: g.xpPetrolRemaining,
        powerDieselRemaining: g.powerDieselRemaining
      };

      return {
        reportId: g.reportId,
        reportDate: g.reportDate,
        reportTime: g.reportTime,
        createdDatetime: g.createdDatetime,
        shift: g.shift,
        createdBy: g.createdByList.join(' + '),
        salesAmount: g.salesAmount,
        stockDetails: JSON.stringify(stockObj)
      };
    });
  }

  calculateDailyReportsTotal(): void {
    this.totalDailyReportsSales = this.dailyReports.reduce((sum, r) => sum + (r.salesAmount || 0), 0);

    const todayStr = this.use.getFormattedDate(new Date());
    const todayReports = this.dailyReports.filter(r => {
      if (!r.createdDatetime) return false;
      const rDate = r.createdDatetime.split('T')[0];
      return rDate === todayStr;
    });

    const uniqueShifts = new Set(todayReports.map(r => r.shift).filter(Boolean));
    this.shiftReportsCount = uniqueShifts.size;
    this.pendingReportsCount = Math.max(0, 3 - this.shiftReportsCount);
  }

  parseStockDetails(stockJson: string): any[] {
    if (!stockJson) return [];
    try {
      const parsed = JSON.parse(stockJson);
      return Object.keys(parsed).map(key => ({
        fuel: key,
        value: parsed[key]
      }));
    } catch (e) {
      return [];
    }
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

}