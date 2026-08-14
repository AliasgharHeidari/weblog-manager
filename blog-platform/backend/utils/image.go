package utils

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	_ "image/png" // پشتیبانی از تصاویر PNG در ورودی
	"mime/multipart"
	"os"
	"path/filepath"

	"github.com/disintegration/imaging"
	"github.com/google/uuid"
)

// SaveImageWithCompression ذخیره تصویر با فشرده‌سازی در صورت بزرگ‌تر از ۲ مگابایت
func SaveImageWithCompression(file *multipart.FileHeader, destFolder string) (string, error) {
	// باز کردن فایل آپلود شده
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	// خواندن تمام بایت‌ها برای بررسی حجم
	buf := new(bytes.Buffer)
	if _, err := buf.ReadFrom(src); err != nil {
		return "", err
	}
	data := buf.Bytes()

	// اگر حجم کمتر یا مساوی ۲ مگابایت بود، همان‌طور ذخیره کن
	const maxSize = 2 * 1024 * 1024 // 2MB
	ext := filepath.Ext(file.Filename)
	filename := uuid.New().String() + ext
	destPath := filepath.Join(destFolder, filename)

	if len(data) <= maxSize {
		if err := os.WriteFile(destPath, data, 0644); err != nil {
			return "", err
		}
		return "/" + destPath, nil
	}

	// نیاز به فشرده‌سازی: decode تصویر
	img, _, err := image.Decode(bytes.NewReader(data))
	if err != nil {
		// اگر decode شکست خورد، نسخه اصلی را ذخیره کن
		if err := os.WriteFile(destPath, data, 0644); err != nil {
			return "", err
		}
		return "/" + destPath, nil
	}

	// اگر عرض تصویر بزرگ‌تر از ۱۹۲۰ بود، کوچک کن
	bounds := img.Bounds()
	if bounds.Dx() > 1920 {
		img = imaging.Resize(img, 1920, 0, imaging.Lanczos)
	}

	// ذخیره به صورت JPEG با کیفیت ۸۰
	outPath := filepath.Join(destFolder, filename[:len(filename)-len(ext)]+".jpg")
	var outBuf bytes.Buffer
	err = jpeg.Encode(&outBuf, img, &jpeg.Options{Quality: 80})
	if err != nil {
		return "", fmt.Errorf("failed to encode compressed image: %v", err)
	}
	if outBuf.Len() <= maxSize {
		os.WriteFile(outPath, outBuf.Bytes(), 0644)
		return "/" + outPath, nil
	}

	// اگر هنوز بزرگ‌تر از ۲ مگابایت بود، کیفیت را کاهش بده
	for quality := 70; quality >= 40; quality -= 10 {
		outBuf.Reset()
		err = jpeg.Encode(&outBuf, img, &jpeg.Options{Quality: quality})
		if err != nil {
			return "", err
		}
		if outBuf.Len() <= maxSize {
			os.WriteFile(outPath, outBuf.Bytes(), 0644)
			return "/" + outPath, nil
		}
	}

	// آخرین راه‌حل: کوچک‌کردن به عرض ۱۲۸۰ و کیفیت ۶۰
	img = imaging.Resize(img, 1280, 0, imaging.Lanczos)
	outBuf.Reset()
	jpeg.Encode(&outBuf, img, &jpeg.Options{Quality: 60})
	os.WriteFile(outPath, outBuf.Bytes(), 0644)
	return "/" + outPath, nil
}
