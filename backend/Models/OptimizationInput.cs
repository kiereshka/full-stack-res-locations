namespace kiereshka.Models;

public class OptimizationInput
{
    public int M { get; set; }
    public int N { get; set; }
    public int D { get; set; }
    public int C { get; set; }
    public required List<LocationData> Locations { get; set; }
}