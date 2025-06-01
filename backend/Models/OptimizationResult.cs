namespace kiereshka.Models;

public class OptimizationResult
{
    public List<int> BestSolution { get; set; }
    public double MaxCapacity { get; set; }
    public double TotalCost { get; set; } // Додано поле для вартості
    public List<Coordinate> ValidCoordinates { get; set; }
}
