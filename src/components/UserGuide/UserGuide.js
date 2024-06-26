import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./UserGuide.css";

function UserGuide() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container className="user-guide-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Kullanıcı Kılavuzu
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        Bu kılavuz size uygulamamızın temel işlevlerini ve kullanım ipuçlarını
        gösterecek.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Derslere Erişim
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        Ana sayfada, mevcut tüm dersleri görebilirsiniz. Bir derse kaydolmak
        için dersin detay sayfasına gidin ve "Kayıt Ol" butonuna tıklayın. Ders
        seviyeleri üçe ayrılır: Başlangıç, Orta ve İleri. Bir sonraki seviyeye
        geçmeden önce mevcut seviyedeki tüm dersleri tamamlamanız gerekmektedir.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        İlerlemeyi Takip Etme
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        Profil sayfanızda, tamamladığınız dersleri ve genel ilerlemenizi takip
        edebilirsiniz. İlerleme çubuğu, tamamladığınız derslerin yüzdesini
        gösterir. Ayrıca, her seviye için farklı rozetler kazanabilirsiniz.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Kullanıcı Rolleri
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        Uygulamada iki ana kullanıcı rolü vardır: Kullanıcı ve Yönetici.
        Kullanıcılar derslere kaydolabilir ve ilerlemelerini takip edebilir.
        Yöneticiler ise dersleri yönetebilir, kullanıcıları görebilir ve sistem
        ayarlarını yapabilir.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Diğer İpuçları
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        Profil sayfanızdan kişisel bilgilerinizi güncelleyebilir ve şifrenizi
        değiştirebilirsiniz. Şifrenizi değiştirmek için mevcut şifrenizi
        girmeniz gerektiğini unutmayın.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoHome}>
        Ana Sayfaya Dön
      </Button>
    </Container>
  );
}

export default UserGuide;
