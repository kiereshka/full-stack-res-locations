namespace kiereshka.Models;

public class OptimizationResult
{
    public List<int> ConflictedIndices { get; set; }
    public List<int> BestSolution { get; set; }
    public double MaxCapacity { get; set; }
    public double TotalCost { get; set; }
    public List<Coordinate> ValidCoordinates { get; set; }
}
