import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import javax.imageio.ImageIO;

public class PngToGifConverter {
    private File[] files;
    
    public PngToGifConverter(File[] files) {
        this.files = files;
    }

    public void run() {
        for (File fileIn : files) {
            String fileNameOut = String.format("%s.gif",
                fileIn.getPath().split(".png")[0]
            );

            try {
                BufferedImage image = ImageIO.read(fileIn);

                File fileOut = new File(fileNameOut);
                ImageIO.write(image, "gif", fileOut);
                System.out.printf("Wrote %s%n",
                    fileNameOut
                );
            } catch (IOException ioe) {
                System.err.println(ioe.getMessage());
            }
        }
    }

    public static void main(String[] args) {
        File folder = new File("../public/assets/images/chips");
        File[] files = folder.listFiles(new FileFilter() {
            @Override
            public boolean accept(File file) {
                return file.getName().contains(".png");
            }
        });

        PngToGifConverter app = new PngToGifConverter(files);
        app.run();
    }
}