interface EmailTemplateProps {
  studentName: string;
  teacherName: string;
  lessonDateTime: Date;
  classroomLink: string;
  lessonType: 'trial' | 'regular';
}

const EmailTemplate = ({
  studentName,
  teacherName,
  lessonDateTime,
  classroomLink,
  lessonType
}: EmailTemplateProps) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .button { 
          background-color: #007bff; 
          color: white; 
          padding: 10px 20px; 
          text-decoration: none; 
          border-radius: 5px; 
          display: inline-block; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>課程預約確認</h1>
        </div>
        <div class="content">
          <p>親愛的 ${studentName}：</p>
          
          <p>您的${lessonType === 'trial' ? '免費體驗' : '正式'}課程已確認！</p>
          
          <h2>課程詳情：</h2>
          <ul>
            <li>老師：${teacherName}</li>
            <li>時間：${lessonDateTime.toLocaleString()}</li>
            <li>課程類型：${lessonType === 'trial' ? '免費體驗' : '正式課程'}</li>
          </ul>

          <p>請使用以下連結進入線上教室：</p>
          
          <p style="text-align: center;">
            <a href="${classroomLink}" class="button">進入教室</a>
          </p>

          <p>注意事項：</p>
          <ul>
            <li>請在課程開始前5分鐘進入教室</li>
            <li>確保您的攝像頭和麥克風正常運作</li>
            <li>準備好筆記本記錄學習重點</li>
          </ul>

          <p>如有任何問題，請隨時與我們聯繫。</p>
          
          <p>祝學習愉快！</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default EmailTemplate;