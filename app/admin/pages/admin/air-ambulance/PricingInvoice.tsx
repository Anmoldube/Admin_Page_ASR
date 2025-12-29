import { useState } from "react";
import { AdminLayout } from "@admin/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  IndianRupee,
  Download,
  Mail,
  FileText,
  Printer,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  Building2,
} from "lucide-react";
import { airAmbulanceAircraft, indianCities } from "@admin/data/airAmbulanceData";
import { cn } from "@/lib/utils";

const PricingInvoice = () => {
  const [selectedAircraft, setSelectedAircraft] = useState("");
  const [sourceCity, setSourceCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [emergencySurcharge, setEmergencySurcharge] = useState(false);
  const [insuranceDiscount, setInsuranceDiscount] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(10);
  
  // Manual overrides
  const [baseCostOverride, setBaseCostOverride] = useState<number | null>(null);
  const [positioningOverride, setPositioningOverride] = useState<number | null>(null);
  const [medicalCrewOverride, setMedicalCrewOverride] = useState<number | null>(null);
  const [landingParkingOverride, setLandingParkingOverride] = useState<number | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const calculatePricing = () => {
    if (!selectedAircraft || !sourceCity || !destinationCity) return null;

    const aircraft = airAmbulanceAircraft.find(a => a.id === selectedAircraft);
    const source = indianCities.find(c => c.name === sourceCity);
    const dest = indianCities.find(c => c.name === destinationCity);

    if (!aircraft || !source || !dest) return null;

    const routeDistance = calculateDistance(source.lat, source.lng, dest.lat, dest.lng);
    const positioningDistance = calculateDistance(aircraft.coordinates.lat, aircraft.coordinates.lng, source.lat, source.lng);

    // Base calculations
    const baseCost = baseCostOverride ?? routeDistance * 150;
    const positioningCost = positioningOverride ?? positioningDistance * 100;
    const medicalCrewCost = medicalCrewOverride ?? (
      (aircraft.medicalConfig.icu ? 25000 : 0) +
      (aircraft.medicalConfig.ventilator ? 15000 : 0) +
      (aircraft.medicalConfig.doctorOnboard ? 20000 : 0) +
      (aircraft.medicalConfig.nurseOnboard ? 10000 : 0)
    );
    const landingParking = landingParkingOverride ?? 15000;

    const subtotal = baseCost + positioningCost + medicalCrewCost + landingParking;
    const emergencyAmount = emergencySurcharge ? subtotal * 0.25 : 0;
    const insuranceAmount = insuranceDiscount ? subtotal * (discountPercent / 100) : 0;
    const asrMargin = (subtotal + emergencyAmount - insuranceAmount) * 0.15;
    const beforeGst = subtotal + emergencyAmount - insuranceAmount + asrMargin;
    const gst = beforeGst * 0.18;
    const total = beforeGst + gst;

    return {
      baseCost,
      positioningCost,
      medicalCrewCost,
      landingParking,
      subtotal,
      emergencyAmount,
      insuranceAmount,
      asrMargin,
      gst,
      total,
      routeDistance,
      positioningDistance,
    };
  };

  const pricing = calculatePricing();

  const PriceRow = ({ 
    label, 
    value, 
    highlight = false,
    editable = false,
    onOverride,
    overrideValue,
  }: { 
    label: string; 
    value: number; 
    highlight?: boolean;
    editable?: boolean;
    onOverride?: (val: number | null) => void;
    overrideValue?: number | null;
  }) => (
    <div className={cn(
      "flex items-center justify-between py-2",
      highlight && "font-bold text-lg"
    )}>
      <span className={highlight ? "text-foreground" : "text-muted-foreground"}>{label}</span>
      <div className="flex items-center gap-2">
        {editable && onOverride && (
          <Input
            type="number"
            placeholder="Override"
            className="w-24 h-8 text-right text-sm"
            value={overrideValue ?? ""}
            onChange={(e) => onOverride(e.target.value ? Number(e.target.value) : null)}
          />
        )}
        <span className={cn("flex items-center", highlight ? "text-foreground" : "")}>
          <IndianRupee className="w-4 h-4" />
          {value.toLocaleString()}
        </span>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pricing Calculator & Invoice</h1>
            <p className="text-muted-foreground">Calculate quotes and generate invoices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Price Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Source City</Label>
                  <Select value={sourceCity} onValueChange={setSourceCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Destination City</Label>
                  <Select value={destinationCity} onValueChange={setDestinationCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Aircraft Selection */}
              <div className="space-y-2">
                <Label>Aircraft</Label>
                <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aircraft" />
                  </SelectTrigger>
                  <SelectContent>
                    {airAmbulanceAircraft.filter(a => a.availability === "Available" || a.availability === "Standby").map((aircraft) => (
                      <SelectItem key={aircraft.id} value={aircraft.id}>
                        {aircraft.name} ({aircraft.registration}) - {aircraft.baseLocation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Emergency Surcharge (25%)</Label>
                    <p className="text-xs text-muted-foreground">Apply for critical missions</p>
                  </div>
                  <Switch
                    checked={emergencySurcharge}
                    onCheckedChange={setEmergencySurcharge}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Insurance Discount</Label>
                    <p className="text-xs text-muted-foreground">Apply insurance coverage discount</p>
                  </div>
                  <Switch
                    checked={insuranceDiscount}
                    onCheckedChange={setInsuranceDiscount}
                  />
                </div>
                {insuranceDiscount && (
                  <div className="flex items-center gap-4">
                    <Label>Discount %</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDiscountPercent(Math.max(5, discountPercent - 5))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{discountPercent}%</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDiscountPercent(Math.min(50, discountPercent + 5))}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Manual Override Section */}
              <div>
                <Label className="text-sm font-medium">Manual Overrides (Optional)</Label>
                <p className="text-xs text-muted-foreground mb-3">Leave blank to use calculated values</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Base Cost</Label>
                    <Input
                      type="number"
                      placeholder="Auto"
                      value={baseCostOverride ?? ""}
                      onChange={(e) => setBaseCostOverride(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Positioning</Label>
                    <Input
                      type="number"
                      placeholder="Auto"
                      value={positioningOverride ?? ""}
                      onChange={(e) => setPositioningOverride(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Medical Crew</Label>
                    <Input
                      type="number"
                      placeholder="Auto"
                      value={medicalCrewOverride ?? ""}
                      onChange={(e) => setMedicalCrewOverride(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Landing/Parking</Label>
                    <Input
                      type="number"
                      placeholder="Auto"
                      value={landingParkingOverride ?? ""}
                      onChange={(e) => setLandingParkingOverride(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Price Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pricing ? (
                <div className="space-y-4">
                  {/* Distance Info */}
                  <div className="p-3 bg-secondary/50 rounded-lg grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Route Distance</span>
                      <p className="font-medium">{pricing.routeDistance} km</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Positioning Distance</span>
                      <p className="font-medium">{pricing.positioningDistance} km</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <PriceRow label="Base Flight Cost" value={pricing.baseCost} />
                    <PriceRow label="Positioning Cost" value={pricing.positioningCost} />
                    <PriceRow label="Medical Crew Cost" value={pricing.medicalCrewCost} />
                    <PriceRow label="Landing & Parking" value={pricing.landingParking} />
                    <Separator />
                    <PriceRow label="Subtotal" value={pricing.subtotal} />
                    
                    {emergencySurcharge && (
                      <div className="flex items-center justify-between py-2 text-warning">
                        <span className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Emergency Surcharge (25%)
                        </span>
                        <span className="flex items-center">
                          + <IndianRupee className="w-4 h-4" />
                          {pricing.emergencyAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    {insuranceDiscount && (
                      <div className="flex items-center justify-between py-2 text-success">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Insurance Discount ({discountPercent}%)
                        </span>
                        <span className="flex items-center">
                          - <IndianRupee className="w-4 h-4" />
                          {pricing.insuranceAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    <PriceRow label="ASR Aviation Margin (15%)" value={pricing.asrMargin} />
                    <PriceRow label="GST (18%)" value={pricing.gst} />
                    <Separator />
                    <PriceRow label="Total Amount" value={Math.round(pricing.total)} highlight />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 gold-gradient text-accent-foreground">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Invoice
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Select route and aircraft to calculate pricing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Invoice Preview */}
        {pricing && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Invoice Preview
                </span>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white dark:bg-card border border-border rounded-lg p-8 max-w-3xl mx-auto">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">ASR AVIATION</h2>
                    <p className="text-sm text-muted-foreground">Air Ambulance Services</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      GSTIN: 07AXXXX1234X1ZX<br />
                      New Delhi, India
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-semibold">TAX INVOICE</h3>
                    <p className="text-sm text-muted-foreground">Invoice No: INV-2024-00123</p>
                    <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Route Details */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="font-medium">{sourceCity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">To</p>
                    <p className="font-medium">{destinationCity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Aircraft</p>
                    <p className="font-medium">
                      {airAmbulanceAircraft.find(a => a.id === selectedAircraft)?.registration}
                    </p>
                  </div>
                </div>

                {/* Line Items */}
                <div className="border border-border rounded-lg overflow-hidden mb-6">
                  <div className="grid grid-cols-4 bg-secondary/50 p-3 font-medium text-sm">
                    <span className="col-span-2">Description</span>
                    <span className="text-right">Qty/Km</span>
                    <span className="text-right">Amount (₹)</span>
                  </div>
                  <div className="divide-y divide-border">
                    <div className="grid grid-cols-4 p-3 text-sm">
                      <span className="col-span-2">Base Flight Cost</span>
                      <span className="text-right">{pricing.routeDistance} km</span>
                      <span className="text-right">{pricing.baseCost.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-4 p-3 text-sm">
                      <span className="col-span-2">Positioning Cost</span>
                      <span className="text-right">{pricing.positioningDistance} km</span>
                      <span className="text-right">{pricing.positioningCost.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-4 p-3 text-sm">
                      <span className="col-span-2">Medical Crew & Equipment</span>
                      <span className="text-right">1</span>
                      <span className="text-right">{pricing.medicalCrewCost.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-4 p-3 text-sm">
                      <span className="col-span-2">Landing & Parking Charges</span>
                      <span className="text-right">1</span>
                      <span className="text-right">{pricing.landingParking.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{pricing.subtotal.toLocaleString()}</span>
                    </div>
                    {emergencySurcharge && (
                      <div className="flex justify-between text-sm text-warning">
                        <span>Emergency Surcharge</span>
                        <span>₹{pricing.emergencyAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {insuranceDiscount && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Insurance Discount</span>
                        <span>-₹{pricing.insuranceAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Service Charge</span>
                      <span>₹{pricing.asrMargin.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST (18%)</span>
                      <span>₹{pricing.gst.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{Math.round(pricing.total).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default PricingInvoice;
