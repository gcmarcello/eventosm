export type ResultModel = {
  result: "time" | "points";
  style: "individual" | "team";
  mode: "league" | "cup";
  cupSettings?: {
    groupStage: boolean;
    groupSize?: number;
  };
  calculation: "sum" | "average";
  pointsAwarded?: [{ position: number; points: number }];
  discard: number;
  absences?: {
    justified: number;
    unjustified: number;
  };
};
