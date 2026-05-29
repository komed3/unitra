export const FrequencyDim = [ -1, 0, 0, 0, 0, 0, 0 ] as const;

export const ForceDim = [ -2, 1, 1, 0, 0, 0, 0 ] as const;

export const PressureDim = [ -2, -1, 1, 0, 0, 0, 0 ] as const;
export const StressDim = PressureDim;

export const EnergyDim = [ -2, 2, 1, 0, 0, 0, 0 ] as const;
export const InternalEnergyDim = EnergyDim;
export const WorkDim = EnergyDim;
export const HeatDim = EnergyDim;
export const TorqueDim = EnergyDim;

export const PowerDim = [ -3, 2, 1, 0, 0, 0, 0 ] as const;
