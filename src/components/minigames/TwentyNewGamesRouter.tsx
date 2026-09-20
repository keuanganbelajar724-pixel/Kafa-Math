import React from 'react';
import {
  AbacusSorobanGame,
  CarrollDiagramGame,
  ThermometerLabGame,
  CoinMoneySorterGame,
  Isometric3DBuilderGame,
} from './CambridgePackGames';
import {
  FactorTreeLabGame,
  PrimeNumberPopGame,
  MagicSquarePuzzleGame,
  RoundingMountainGame,
  DotPatternSequenceGame,
} from './ArithmeticPackGames';
import {
  CompassBearingsGame,
  TimeDurationBusGame,
  SpeedDistanceTimeGame,
  WeightConversionLiftGame,
  MeanMedianSeesawGame,
} from './MeasurementDataPackGames';
import {
  FractionDecimalPercentGame,
  MirrorCoordinatesGame,
  CongruentShapesGame,
  RatioRecipeMixGame,
  SudokuMiniKidsGame,
} from './LogicAdvancedPackGames';
import {
  OrderOfOperationsRunnerGame,
  KpkFpbRocketRaceGame,
  NegativeSubmarineGame,
  CircleGeometryLabGame,
  MeanMedianDetectiveGame,
} from './MasteryCurriculumPackGames';
import {
  FarmCountingBondsGame,
  FruitTrainPatternGame,
  StarBalanceCompareGame,
  FrogJumpNumberlineGame,
  FruitStorePlaceValueGame,
  ShapesDetectiveQuestGame,
  CatCastleClockGame,
  MiniMarketCoinsGame,
  RobotSpatialMazeGame,
  JengkalMagicRulerGame,
  PizzaFractionPartyGame,
  ThermometerWeatherLabGame,
} from './GradeOneInteractivePackGames';
import {
  AlgebraBalanceScaleGame,
  CoordinateTreasureIslandGame,
} from './WorldClassPackGames';

export const TWENTY_NEW_GAME_IDS = [
  'abacus_soroban',
  'carroll_diagram',
  'thermometer_lab',
  'coin_money_sorter',
  'isometric_3d_builder',
  'factor_tree_lab',
  'prime_number_pop',
  'magic_square_puzzle',
  'rounding_mountain',
  'dot_pattern_sequence',
  'compass_bearings',
  'time_duration_bus',
  'speed_distance_time',
  'weight_conversion_lift',
  'mean_median_seesaw',
  'fraction_decimal_percent',
  'mirror_coordinates',
  'congruent_shapes',
  'ratio_recipe_mix',
  'sudoku_mini_kids',
  'order_of_operations_runner',
  'kpk_fpb_race',
  'negative_number_submarine',
  'circle_geometry_lab',
  'mean_median_mode_detective',
  'farm_counting_bonds',
  'fruit_train_pattern',
  'star_balance_compare',
  'frog_jump_numberline',
  'fruit_store_place_value',
  'shapes_detective_quest',
  'cat_castle_clock',
  'mini_market_coins',
  'robot_spatial_maze',
  'jengkal_magic_ruler',
  'pizza_fraction_party',
  'thermometer_weather_lab',
  'algebra_balance_scale',
  'coordinate_treasure_island',
] as const;

export type TwentyNewGameId = (typeof TWENTY_NEW_GAME_IDS)[number];

interface TwentyNewGamesRouterProps {
  gameId: string;
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
  onRewardXP?: (xp: number, coins: number) => void;
}

export const TwentyNewGamesRouter: React.FC<TwentyNewGamesRouterProps> = ({
  gameId,
  onComplete,
  onExit,
  onRewardXP = () => {},
}) => {
  switch (gameId) {
    case 'abacus_soroban':
      return <AbacusSorobanGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'carroll_diagram':
      return <CarrollDiagramGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'thermometer_lab':
      return <ThermometerLabGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'coin_money_sorter':
      return <CoinMoneySorterGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'isometric_3d_builder':
      return <Isometric3DBuilderGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;

    case 'factor_tree_lab':
      return <FactorTreeLabGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'prime_number_pop':
      return <PrimeNumberPopGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'magic_square_puzzle':
      return <MagicSquarePuzzleGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'rounding_mountain':
      return <RoundingMountainGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'dot_pattern_sequence':
      return <DotPatternSequenceGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;

    case 'compass_bearings':
      return <CompassBearingsGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'time_duration_bus':
      return <TimeDurationBusGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'speed_distance_time':
      return <SpeedDistanceTimeGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'weight_conversion_lift':
      return <WeightConversionLiftGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'mean_median_seesaw':
      return <MeanMedianSeesawGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;

    case 'fraction_decimal_percent':
      return <FractionDecimalPercentGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'mirror_coordinates':
      return <MirrorCoordinatesGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'congruent_shapes':
      return <CongruentShapesGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'ratio_recipe_mix':
      return <RatioRecipeMixGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'sudoku_mini_kids':
      return <SudokuMiniKidsGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;

    case 'order_of_operations_runner':
      return <OrderOfOperationsRunnerGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'kpk_fpb_race':
      return <KpkFpbRocketRaceGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'negative_number_submarine':
      return <NegativeSubmarineGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'circle_geometry_lab':
      return <CircleGeometryLabGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'mean_median_mode_detective':
      return <MeanMedianDetectiveGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;

    case 'farm_counting_bonds':
      return <FarmCountingBondsGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'fruit_train_pattern':
      return <FruitTrainPatternGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'star_balance_compare':
      return <StarBalanceCompareGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'frog_jump_numberline':
      return <FrogJumpNumberlineGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'fruit_store_place_value':
      return <FruitStorePlaceValueGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'shapes_detective_quest':
      return <ShapesDetectiveQuestGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'cat_castle_clock':
      return <CatCastleClockGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'mini_market_coins':
      return <MiniMarketCoinsGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'robot_spatial_maze':
      return <RobotSpatialMazeGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'jengkal_magic_ruler':
      return <JengkalMagicRulerGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'pizza_fraction_party':
      return <PizzaFractionPartyGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'thermometer_weather_lab':
      return <ThermometerWeatherLabGame gameId={gameId} onComplete={onComplete} onExit={onExit} />;
    case 'algebra_balance_scale':
      return <AlgebraBalanceScaleGame onExit={onExit} onRewardXP={onRewardXP} />;
    case 'coordinate_treasure_island':
      return <CoordinateTreasureIslandGame onExit={onExit} onRewardXP={onRewardXP} />;

    default:
      return null;
  }
};
