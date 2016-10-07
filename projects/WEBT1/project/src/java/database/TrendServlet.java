/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package database;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;

import java.sql.*;
import java.util.*;
import javax.naming.*;
import javax.sql.*;

import org.json.simple.parser.JSONParser;
import org.json.simple.*;


import database.TgList;

/**
 *
 * @author sealeks@mail.ru
 */
public class TrendServlet extends HttpServlet {

    /** 
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        ///response.setContentType("text/html;charset=UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();

        boolean init = false;

        try {

            JSONParser parser = new JSONParser();
            ArrayList requesttags = new ArrayList();
            Date start = null;
            Date stop = null;

            try {
                Object tstreq = parser.parse(request.getReader());
                JSONObject jobj = (JSONObject) tstreq;
                if (jobj != null) {
                    Object tagarr = jobj.get("tags");
                    Object strtobj = jobj.get("start");
                    Object stpobj = jobj.get("stop");
                    Object initobj = jobj.get("init");
                    if (initobj != null) {
                        init = true;
                    } else if (tagarr != null && strtobj != null && stpobj != null) {
                        long offs = java.util.TimeZone.getDefault().getRawOffset();
                        JSONArray jarray = (JSONArray) tagarr;
                        long jstart = java.lang.Long.parseLong(strtobj.toString());
                        long jstop = java.lang.Long.parseLong(stpobj.toString());
                        start = new Date(jstart);
                        stop = new Date(jstop);
                        System.out.println(jstart);
                        System.out.println(jstop);
                        System.out.println(start);
                        System.out.println(stop);
                        System.out.println(offs);
                        if (jarray != null && start != null && stop != null) {
                            for (int i = 0; i < jarray.size(); ++i) {
                                requesttags.add((String) jarray.get(i));
                            }
                        }
                    }
                }
            } catch (org.json.simple.parser.ParseException exp) {
            } catch (java.lang.Exception e) {
            }


            if (init) {
                proccessTagsRequest(out);
            } else if (requesttags.size() != 0 && start != null && stop != null) {
                proccessTrendsRequest(out, requesttags, start, stop);
            } else {
                proccessErrorRequest(out, "1");
            }


        } finally {
            out.close();
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /** 
     * Handles the HTTP <code>GET</code> method.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /** 
     * Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /** 
     * Returns a short description of the servlet.
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    private void proccessTagsRequest(PrintWriter out) {
        ServletContext sc = getServletContext();
        TgList tagList = (TgList) sc.getAttribute("sessionTL");
        JSONObject result = new JSONObject();
        if (tagList != null) {
            JSONArray tags = new JSONArray();
            List tglist = tagList.getList();
            for (Object item : tglist) {
                TgList.TgListEllement tg =
                        (TgList.TgListEllement) item;
                JSONObject jsntag = new JSONObject();
                jsntag.put("cod", tg.getId());
                jsntag.put("comment", tg.getComment());
                jsntag.put("eu", tg.getUE());
                jsntag.put("mineu", tg.minUE());
                jsntag.put("maxeu", tg.maxUE());
                jsntag.put("name", tg.getName());
                jsntag.put("type", tg.getType());
                tags.add(jsntag);
            }
            result.put("tags", tags);
        } else {
            result.put("error", "Not context");
        }
        out.print(result.toString());
    }

    private void proccessTrendsRequest(PrintWriter out, ArrayList lst, Date start, Date stop) {

        Connection conn = null;

        ServletContext sc = getServletContext();
        TgList tagList = (TgList) sc.getAttribute("sessionTL");

        try {
            if (tagList != null) {
                JSONArray result = new JSONArray();
                for (int i = 0; i < lst.size(); ++i) {
                    TgList.TgListEllement tg = tagList.find((String) lst.get(i));
                    if (tg != null) {
                        proccessTrendRequest(conn, result, tg, start, stop);
                    } else {
                    }
                }
                out.print(result.toString());
                return;
            }
        } catch (java.lang.Exception e) {
        } finally {
            try {
                if ((conn != null) && (!conn.isClosed())) {
                    conn.close();
                }
            } catch (java.sql.SQLException exp) {
            }
        }

        JSONObject result = new JSONObject();
        result.put("error", "Not context");


    }

    private void proccessTrendRequest(Connection conn, JSONArray result, TgList.TgListEllement tg, Date start, Date stop) {

        Statement stmt = null;
        ResultSet rset = null;

        JSONObject jsntag = new JSONObject();
        jsntag.put("cod", tg.getId());

        try {

            if (conn == null) {
                //conn = ImmConnect.getLocalConn("trend");
            }

            JSONArray data = new JSONArray();

            long lstart = start.getTime();
            long lstop = stop.getTime();
            long inc = 1000 * 3600 * 24;

            stmt = conn.createStatement();



            while (lstop >= lstart) {

                /*String tn = Immi.DateUtil.getNameTable(lstart, "tr");


                boolean double_req = (tn != Immi.DateUtil.getNameTable(lstart + inc, "tr"));

                for (int i = 0; i < 2; i++) {

                    String query = "SELECT tm, val FROM " + tn + " WHERE ((cod=" + tg.getId() +
                            ") and ((tm>='" + Immi.DateUtil.TimeToDT(lstart) + "') and (tm<='" +
                            Immi.DateUtil.TimeToDT(lstop) + "'))) ORDER BY tm ASC ";
                    try {
                        rset = stmt.executeQuery(query);
                        while (rset.next()) {
                            JSONArray point = new JSONArray();
                            Timestamp ts = rset.getTimestamp("tm");
                            point.add(ts.getTime());
                            if (rset.getObject("val") != null) {
                                point.add(rset.getObject("val"));
                            } else {
                                point.add("");
                            }
                            data.add(point);
                        }
                    } catch (java.sql.SQLException exp) {
                    } finally {
                    }
                    if (double_req) {
                        tn = Immi.DateUtil.getNameTable(lstart + inc, "tr");
                    } else {
                        break;
                    }
                }*/

                lstart += inc;

            }

            jsntag.put("comment", tg.getComment());
            jsntag.put("eu", tg.getUE());
            jsntag.put("mineu", tg.minUE());
            jsntag.put("maxeu", tg.maxUE());
            jsntag.put("name", tg.getName());
            jsntag.put("data", data);

        } catch (java.sql.SQLException exp) {
            jsntag.put("error", exp.toString());
        } finally {
            //ImmConnect.closeConn(conn, stmt, rset);
        }
        result.add(jsntag);
    }

    private void proccessErrorRequest(PrintWriter out, Object error) {
        JSONObject result = new JSONObject();
        result.put("error", error);
        out.print(result.toString());
    }
}
