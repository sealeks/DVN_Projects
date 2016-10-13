package database;

import java.io.Serializable;
import java.util.*;

public class TagList extends HashMap implements Serializable {

    public static class Tag implements Comparable, Serializable {

        int tgid;
        String Name;
        String Comment;
        String EU;
        double minEU;
        double maxEU;
        int type;

        public Tag(int itgid,
                String iName,
                String iComment,
                String iEU,
                double iminEU,
                double imaxEU,
                int type) {
            tgid = itgid;
            Name = iName.trim().toUpperCase();
            Comment = iComment;
            EU = iEU;
            minEU = iminEU;
            maxEU = imaxEU;
            this.type = type;

        }

        public int compareTo(Object o1) {
            return toString().compareTo(o1.toString());
        }

        public String toString() {
            return Name;
        }
        public String getName() {
            return Name;
        }

        public String getId() {
            return String.valueOf(tgid);
        }

        public String getComment() {
            return Comment;
        }

        public String getUE() {
            return EU;
        }

        public double minUE() {
            return minEU;
        }

        public double maxUE() {
            return maxEU;
        }

        public int getType() {
            return type;
        }
    }

    private HashMap IntMap = new HashMap();
    private List ObjList = new ArrayList();

    public TagList() {
    }

    public List getList() {
        return ObjList;
    }

    public boolean add(Tag val) {
        if (val == null) {
            return false;
        }
        if (!(val instanceof Tag)) {
            return false;
        }
        if (get(val.Name.toUpperCase()) != null) {
            return false;
        }
        if (IntMap.get(String.valueOf(val.tgid)) != null) {
            return false;
        }
        ObjList.add(val);
        Collections.sort(ObjList);
        put(val.Name.toUpperCase(), val);
        IntMap.put(String.valueOf(val.tgid), val);
        return true;
    }

    public Tag find(String val) {
        return ((Tag) get(val));
    }

    public Tag find(int tgid) {
        return ((Tag) IntMap.get(String.valueOf(tgid)));
    }

    public int FindId(String val) {
        String val_ = val.toUpperCase();
        Tag temp_ = find(val_);
        if (temp_ == null) {
            return -1;
        }
        return temp_.tgid;
    }

    public int FindNum(String val) {
        int id = (Collections.binarySearch(ObjList, val.trim().toUpperCase()));
        if (id < 0) {
            return -1;
        } else {
            return id;
        }
    }

    public String FindComment(String val) {
        String val_ = val.toUpperCase();
        Tag temp_ = find(val_);
        if (temp_ == null) {
            return "";
        }
        return temp_.Comment;
    }

    public String FindUE(String val) {
        String val_ = val.toUpperCase();
        Tag temp_ = find(val_);
        if (temp_ == null) {
            return "";
        }
        return temp_.EU;
    }

    public double FindMin(String val) {
        String val_ = val.toUpperCase();
        Tag temp_ = find(val_);
        if (temp_ == null) {
            return 0;
        }
        return temp_.minEU;
    }

    public double FindMax(String val) {
        String val_ = val.toUpperCase();
        Tag temp_ = find(val_);
        if (temp_ == null) {
            return 0;
        }
        return temp_.maxEU;

    }

    public String getComment(int val) {
        if (val >= size()) {
            return "";
        }
        return ((Tag) ObjList.get(val)).Comment;
    }

    public String getId(int val) {
        if (val >= size()) {
            return "";
        }
        return String.valueOf(((Tag) ObjList.get(val)).tgid);
    }

    public String getEU(int val) {
        if (val >= size()) {
            return "";
        }
        return ((Tag) ObjList.get(val)).EU;
    }

    public String getName(int val) {
        if (val >= size()) {
            return "";
        }
        return ((Tag) ObjList.get(val)).Name;
    }

    public void assign(TagList val) {
        Tag temp_;
        if (val == null) {
            return;
        }
        val.clear();
        val.IntMap.clear();
        val.ObjList.clear();
        Iterator temp_iter = this.values().iterator();
        while (temp_iter.hasNext()) {
            temp_ = ((Tag) temp_iter.next());
            add(temp_);
        }

    }

}
