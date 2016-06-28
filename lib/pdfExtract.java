import com.itextpdf.text.exceptions.UnsupportedPdfException;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.XfaForm;
import com.itextpdf.text.xml.XmlDomWriter;

import java.io.IOException;

import org.w3c.dom.Node;

public class pdfExtract {
    public static void main(String[] args) throws IOException {
      if (new pdfExtract().parse()) {
        System.exit(0);
      } else {
        System.exit(-1);
      }
    }

    public boolean parse() throws IOException {
        PdfReader reader = new PdfReader(System.in);
        XfaForm xfa = reader.getAcroFields().getXfa();
        XmlDomWriter xml = new XmlDomWriter();
        Node node = xfa.getDatasetsNode().getFirstChild();
        while (node != null) {
          if (node.getNodeName().equals("xfa:data")) {
            break;
          }
          System.out.println(node.getNodeName());
          node = node.getNextSibling();
        }

        if (node != null) {
          xml.setOutput(System.out, null);
          xml.write(xfa.getDatasetsNode());
          return true;
        }
        return false;
    }
}
