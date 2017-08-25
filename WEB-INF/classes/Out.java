import java.util.ArrayList;

/**
 * this class is for output of json files.
 */
public class Out {
    public int iters;
    public boolean success;
    public ArrayList<Iter> result = new ArrayList<>();
        
    public void setToIter(int clusterNum, ArrayList<Point> centroid,ArrayList<Integer> allocation){
        Iter iter = new Iter();
        iter.centroid = centroid;
        iter.allocation = allocation;
        iter.clusterNum = clusterNum;
        result.add(iter);
    }
}

class Iter{
    public int clusterNum;
    public ArrayList<Point> centroid = new ArrayList<>();
    public ArrayList<Integer> allocation = new ArrayList<>();
}
